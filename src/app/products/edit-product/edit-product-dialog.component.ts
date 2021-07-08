import {
  CategoryDto,
  CategoryServiceProxy,
  ProductDto,
  ProductServiceProxy,
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
  templateUrl: "edit-Product-dialog.component.html",
})
export class EditProductDialogComponent
  extends AppComponentBase
  implements OnInit
{
  saving = false;
  id: number;
  product = new ProductDto();
  categories: CategoryDto[] = [];

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _categoryService: CategoryServiceProxy,
    private _productService: ProductServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getCategories();
    this._productService.get(this.id).subscribe((result) => {
      this.product = result.result;
    });
  }

  save(): void {
    this.saving = true;

    const createProduct = new ProductDto();
    createProduct.init(this.product);
    this._productService
      .update(createProduct)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(
        (response) => {
          this.notify.info(response.error);
          this.bsModalRef.hide();
          this.onSave.emit();
        },
        (responseError) => {
          this.notify.info(responseError.error.error.message);
          this.bsModalRef.hide();
          abp.message.error(responseError.error.error.message, this.l("Error"));
        }
      );
  }
  getCategories() {
    this._categoryService
      .getAll()
      .subscribe((result) => (this.categories = result.result));
  }
}
