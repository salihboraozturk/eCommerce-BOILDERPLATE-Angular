import {
  CategoryDto,
  CategoryServiceProxy,
} from "./../../../shared/service-proxies/service-proxies";
import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef } from "ngx-bootstrap/modal";
import {
  forEach as _forEach,
  includes as _includes,
  map as _map,
} from "lodash-es";
import { AppComponentBase } from "@shared/app-component-base";

@Component({
  templateUrl: "edit-category-dialog.component.html",
})
export class EditCategoryDialogComponent
  extends AppComponentBase
  implements OnInit
{
  saving = false;
  id: number;
  category = new CategoryDto();

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _categoryService: CategoryServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._categoryService.get(this.id).subscribe((result) => {
      this.category = result.result;
    });
  }

  save(): void {
    this.saving = true;

    const createCategory = new CategoryDto();
    createCategory.init(this.category);

    this._categoryService
      .update(createCategory)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((response) => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.bsModalRef.hide();
        this.onSave.emit();
      },(responseError) => {
        this.notify.info(responseError.error.error.message);
        this.bsModalRef.hide();
        abp.message.error(responseError.error.error.message,this.l("Error"));
      });
  }
}
