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
  ProductServiceProxy,
  ProductDto,
  ProductViewDto,
  CreateProductDto,
  CategoryDto,
  CategoryServiceProxy,
} from "@shared/service-proxies/service-proxies";

import { forEach as _forEach, map as _map } from "lodash-es";
import { AppComponentBase } from "@shared/app-component-base";

@Component({
  templateUrl: "create-Product-dialog.component.html",
})
export class CreateProductDialogComponent
  extends AppComponentBase
  implements OnInit
{
  product = new ProductDto();
  saving = false;
  categories: CategoryDto[] = [];

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private _productService: ProductServiceProxy,
    private _categoryService: CategoryServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getCategories();
  }

  save(): void {
    this.saving = true;

    const createProduct = new CreateProductDto();
    createProduct.init(this.product);
    this._productService
      .create(createProduct)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(
        () => {
          this.notify.info(this.l("SavedSuccessfully"));
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
