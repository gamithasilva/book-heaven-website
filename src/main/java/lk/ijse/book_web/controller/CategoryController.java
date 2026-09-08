package lk.ijse.book_web.controller;

import lk.ijse.book_web.dto.CommonResponse;
import lk.ijse.book_web.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/category")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/getAll")
    public CommonResponse getAllCategories(){
        categoryService.getAllCategories();
        return new CommonResponse(200,categoryService.getAllCategories(),"OPERATION SUCCESS");
    }
}
