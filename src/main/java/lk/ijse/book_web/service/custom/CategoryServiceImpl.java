package lk.ijse.book_web.service.custom;

import lk.ijse.book_web.dto.CategoryDTO;
import lk.ijse.book_web.entity.Category;
import lk.ijse.book_web.exception.CustomException;
import lk.ijse.book_web.repository.CategoryRepository;
import lk.ijse.book_web.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    @Override
    public void saveCategory(CategoryDTO categoryDTO) {
        log.info("Saving category {}", categoryDTO);
        try{
            Category category = new Category();
            category.setName(categoryDTO.getName());
            category.setDescription(categoryDTO.getDescription());
            categoryRepository.save(category);
        }catch (Exception e){
            log.error("failed to save category{}", String.valueOf(e));
            throw new CustomException(500,"failed to save category");

        }

    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        log.info("Fetching all categories");
        try {
            List<Category> categories = categoryRepository.findAll();

            return categories.stream()
                    .map(category -> new CategoryDTO(
                            category.getId(),
                            category.getName(),
                            category.getDescription(),
                            category.getStatus(),
                            category.getCreatedAt()))
                    .toList();
        } catch (Exception e) {
            log.error("failed to fetch categories{}", String.valueOf(e));
            throw new CustomException(500, "failed to fetch categories");
        }


    }

    @Override
    public CategoryDTO getCategoryDetails(Long id){
        log.info("Fetching category {}", id);
        Optional<Category> OptionalCategory = categoryRepository.findById(id);
        if(OptionalCategory.isEmpty()){
            throw new CustomException(404,"category not found");
        }
        Category category = OptionalCategory.get();
        return new CategoryDTO(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getStatus(),
                category.getCreatedAt());
    }




}
