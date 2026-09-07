package lk.ijse.book_web.service.custom;

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



}
