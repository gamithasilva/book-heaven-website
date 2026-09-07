package lk.ijse.book_web.service.custom;

import lk.ijse.book_web.dto.CategoryDTO;
import lk.ijse.book_web.entity.Category;
import lk.ijse.book_web.exception.CustomException;
import lk.ijse.book_web.repository.CategoryRepository;
import lk.ijse.book_web.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

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



}
