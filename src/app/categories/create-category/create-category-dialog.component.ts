import { Router } from "@angular/router";
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
  CategoryServiceProxy,
  CategoryDto,
  CategoryViewDto,
  CreateCategoryDto,
} from "@shared/service-proxies/service-proxies";

import { forEach as _forEach, map as _map } from "lodash-es";
import { AppComponentBase } from "@shared/app-component-base";

@Component({
  templateUrl: "create-category-dialog.component.html",
})
export class CreateCategoryDialogComponent
  extends AppComponentBase
  implements OnInit
{
  category = new CategoryDto();
  saving = false;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private _categoryService: CategoryServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {}

  save(): void {
    this.saving = true;

    const category = new CreateCategoryDto();
    category.init(this.category);
    this._categoryService
      .create(category)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(
        (response) => {
          this.notify.info(this.l("SavedSuccessfully"));
          this.bsModalRef.hide();
          this.onSave.emit();
        },
        (responseError) => {
          this.notify.info(responseError.error.error.message);
          this.bsModalRef.hide();
          abp.message.error(responseError.error.error.message,this.l("Error"));
        }
      );
  }
}
