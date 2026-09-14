package lk.ijse.book_web.service.custom;

import lk.ijse.book_web.dto.WishlistDTO;
import lk.ijse.book_web.dto.WishlistItemDTO;
import lk.ijse.book_web.entity.Book;
import lk.ijse.book_web.entity.Customer;
import lk.ijse.book_web.entity.Wishlist;
import lk.ijse.book_web.entity.WishlistItem;
import lk.ijse.book_web.exception.CustomException;
import lk.ijse.book_web.repository.BookRepository;
import lk.ijse.book_web.repository.CustomerRepository;
import lk.ijse.book_web.repository.WishlistItemRepository;
import lk.ijse.book_web.repository.WishlistRepository;
import lk.ijse.book_web.service.WishlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService{
    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final BookRepository bookRepository;
    private final CustomerRepository customerRepository;

    @Override
    public void addToWishlist(Long bookId, String username){
        Customer customer = customerRepository.findByEmail(username)
                .orElseThrow(() -> new CustomException(404, "Customer not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new CustomException(404, "Book not found"));

        Wishlist wishlist = wishlistRepository
                .findByCustomerId(customer.getId())
                .orElseGet(() -> {
                   Wishlist newWishlist = new Wishlist();
                   newWishlist.setCustomer(customer);

                   return wishlistRepository.save(newWishlist);
                });

        if(wishlistItemRepository.existsByWishlistIdAndBookId(wishlist.getId(), book.getId())){
            throw new CustomException(409, "Wishlist already exists");
        }

        WishlistItem item = new WishlistItem();
        item.setBook(book);
        item.setWishlist(wishlist);

        wishlistItemRepository.save(item);

        wishlist.setUpdatedAt(LocalDateTime.now());
        wishlistRepository.save(wishlist);
    }


//    @Override
//    public void removeFromWishlist(Long bookId, String username){
//        Customer customer = customerRepository.findByEmail(username)
//                .orElseThrow(() -> new CustomException(404, "Customer not found"));
//
//        Wishlist wishlist = wishlistRepository.findByCustomerId(customer.getId())
//                .orElseThrow(() -> new CustomException(404, "Wishlist not found"));
//        wishlistItemRepository.deleteByWishlistIdAndBookId(wishlist.getId(), bookId);
//
//        wishlist.setUpdatedAt(LocalDateTime.now());
//
//        wishlistRepository.save(wishlist);
//
//
//    }

    @Override
    @Transactional
    public void removeFromWishlist(Long bookId, String username) {

        Customer customer = customerRepository.findByEmail(username)
                .orElseThrow(() ->
                        new CustomException(404, "Customer not found"));

        Wishlist wishlist = wishlistRepository.findByCustomerId(customer.getId())
                .orElseThrow(() ->
                        new CustomException(404, "Wishlist not found"));

        WishlistItem item = wishlistItemRepository
                .findByWishlistIdAndBookId(wishlist.getId(), bookId)
                .orElseThrow(() ->
                        new CustomException(404, "Book is not in wishlist"));

        wishlist.getItems().remove(item);

        wishlist.setUpdatedAt(LocalDateTime.now());

        wishlistRepository.save(wishlist);
    }

    @Override
    public WishlistDTO getWishlist(String username){

        Customer customer = customerRepository
                .findByEmail(username)
                .orElseThrow(() ->
                        new CustomException(404, "Customer not found"));

        Wishlist wishlist = wishlistRepository
                .findByCustomerId(customer.getId())
                .orElse(null);

        if(wishlist == null){
            return new WishlistDTO(
                    null,
                    customer.getId(),
                    new ArrayList<>()
            );
        }

        List<WishlistItemDTO> items =
                wishlist.getItems()
                        .stream()
                        .map(item -> {
                            Book book = item.getBook();

                            return new WishlistItemDTO(
                                    item.getId(),
                                    book.getId(),
                                    book.getTitle(),
                                    book.getAuthor(),
                                    book.getSellingPrice(),
                                    book.getCoverImage()
                            );
                        }).toList();


        return new WishlistDTO(
                wishlist.getId(),
                customer.getId(),
                items
        );

    }
}
