package lk.ijse.book_web.service;

import lk.ijse.book_web.dto.CategoryDTO;

import java.util.List;

public interface CategoryService {
    void saveCategory(CategoryDTO categoryDTO);

    List<CategoryDTO> getAllCategories();

    CategoryDTO getCategoryDetails(Long id);
}
