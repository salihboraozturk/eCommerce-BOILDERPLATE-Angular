import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Component, Injector } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  ProductServiceProxy,
  ProductDto,
  ProductViewDto,
  AuthServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { PagedListingComponentBase } from "@shared/paged-listing-component-base";
import { CreateProductDialogComponent } from "./create-product/create-product-dialog.component";
import { finalize } from "rxjs/operators";
import { EditProductDialogComponent } from "./edit-product/edit-product-dialog.component";

@Component({
  templateUrl: "./products.component.html",
  animations: [appModuleAnimation()],
})
export class ProductsComponent extends PagedListingComponentBase<ProductDto> {
  products: ProductViewDto[] = [];
  bsModalRef: any;
  constructor(
    private _authService: AuthServiceProxy,
    private _productService: ProductServiceProxy,
    injector: Injector,
    private _modalService: BsModalService
  ) {
    super(injector);
  }
  list(): void {
    this._productService.getAllProductsDetail().subscribe((result) => {
      this.products = result.result;
      console.log(this.products);
    });
  }
  delete(product: ProductDto): void {
    abp.message.confirm(
      this.l("ProductDeleteWarningMessage", product.productName),
      undefined,
      (result: boolean) => {
        if (result) {
          this._productService.delete(product.id).subscribe(
            () => {
              this.list();
            },
            (responseError) => {
              abp.message.error(
                responseError.error.error.message,
                this.l("Error")
              );
              this.bsModalRef.hide();
            }
          );
        }
      }
    );
  }
  createProduct(): void {
    this.showCreateOrEditProductDialog();
  }

  editProduct(Product: ProductDto): void {
    this.showCreateOrEditProductDialog(Product.id);
  }

  showCreateOrEditProductDialog(id?: number): void {
    let createOrEditProductDialog: BsModalRef;
    if (!id) {
      createOrEditProductDialog = this._modalService.show(
        CreateProductDialogComponent,
        {
          class: "modal-lg",
        }
      );
    } else {
      createOrEditProductDialog = this._modalService.show(
        EditProductDialogComponent,
        {
          class: "modal-lg",
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditProductDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
  checkManuplation() {
    return this._authService.checkAdminOrManuplation();
  }
}
