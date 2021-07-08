import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Component, Injector } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  CategoryServiceProxy,
  CategoryDto,
  CategoryViewDto,
  AuthServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { PagedListingComponentBase } from "@shared/paged-listing-component-base";
import { CreateCategoryDialogComponent } from "./create-category/create-category-dialog.component";
import { finalize } from "rxjs/operators";
import { EditCategoryDialogComponent } from "./edit-category/edit-category-dialog.component";

@Component({
  templateUrl: "./categories.component.html",
  animations: [appModuleAnimation()],
})
export class CategoriesComponent extends PagedListingComponentBase<CategoryDto> {
  categories: CategoryDto[] = [];
  bsModalRef: any;
  constructor(
    private _categoryService: CategoryServiceProxy,
    injector: Injector,
    private _modalService: BsModalService,
    private _authService: AuthServiceProxy
  ) {
    super(injector);
  }
  list(): void {
    this._categoryService.getAll().subscribe((result) => {
      this.categories = result.result;
    });
  }
  delete(category: CategoryDto): void {
    abp.message.confirm(
      this.l("CategoryDeleteWarningMessage", category.categoryName),
      undefined,
      (result: boolean) => {
        if (result) {
          this._categoryService.delete(category.id).subscribe(
            (result) => {
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
  createCategory(): void {
    this.showCreateOrEditCategoryDialog();
  }

  editCategory(category: CategoryDto): void {
    this.showCreateOrEditCategoryDialog(category.id);
  }

  showCreateOrEditCategoryDialog(id?: number): void {
    let createOrEditCategoryDialog: BsModalRef;
    if (!id) {
      createOrEditCategoryDialog = this._modalService.show(
        CreateCategoryDialogComponent,
        {
          class: "modal-lg",
        }
      );
    } else {
      createOrEditCategoryDialog = this._modalService.show(
        EditCategoryDialogComponent,
        {
          class: "modal-lg",
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditCategoryDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
  checkManuplation() {
    return this._authService.checkAdminOrManuplation();
  }
}
