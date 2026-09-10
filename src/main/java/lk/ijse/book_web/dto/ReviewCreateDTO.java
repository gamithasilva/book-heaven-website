package lk.ijse.book_web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ReviewCreateDTO {

    private Integer rating;
    private String comment;
}
