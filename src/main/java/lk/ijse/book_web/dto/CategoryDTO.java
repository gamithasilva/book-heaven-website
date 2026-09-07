package lk.ijse.book_web.dto;

import lk.ijse.book_web.enumuration.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CategoryDTO {

    private Long id;
    private String name;
    private String description;
    private AccountStatus status;
    private LocalDateTime createdAt;

}
