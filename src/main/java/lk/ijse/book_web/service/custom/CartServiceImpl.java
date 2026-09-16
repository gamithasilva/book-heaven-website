package lk.ijse.book_web.service.custom;

import lk.ijse.book_web.dto.CartDTO;
import lk.ijse.book_web.dto.CartItemDTO;
import lk.ijse.book_web.entity.Book;
import lk.ijse.book_web.entity.Cart;
import lk.ijse.book_web.entity.CartItem;
import lk.ijse.book_web.entity.Customer;
import lk.ijse.book_web.repository.BookRepository;
import lk.ijse.book_web.repository.CartItemRepository;
import lk.ijse.book_web.repository.CartRepository;
import lk.ijse.book_web.repository.CustomerRepository;
import lk.ijse.book_web.service.CartSevice;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartSevice {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CustomerRepository customerRepository;
    private final BookRepository bookRepository;


    // =========================================================
    // GET CART
    // =========================================================

    @Override
    public CartDTO getCart(String email) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        Cart cart = cartRepository.findByCustomer(customer)
                .orElseGet(() -> createCart(customer));

        return convertToDTO(cart);
    }


    // =========================================================
    // ADD TO CART
    // =========================================================

    @Override
    public CartDTO addToCart(Long bookId, Integer quantity, String email) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new RuntimeException("Book not found"));

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        Cart cart = cartRepository.findByCustomer(customer)
                .orElseGet(() -> createCart(customer));

        // Check whether book already exists in cart
        CartItem cartItem = cartItemRepository
                .findByCartIdAndBookId(cart.getId(), bookId)
                .orElse(null);

        if (cartItem != null) {

            int newQuantity = cartItem.getQuantity() + quantity;

            if (newQuantity > book.getStock()) {
                throw new RuntimeException("Not enough stock available");
            }

            cartItem.setQuantity(newQuantity);

            BigDecimal subtotal =
                    cartItem.getUnitPrice()
                            .multiply(BigDecimal.valueOf(newQuantity));

            cartItem.setSubtotal(subtotal);

            cartItemRepository.save(cartItem);

        } else {

            if (quantity > book.getStock()) {
                throw new RuntimeException("Not enough stock available");
            }

            CartItem newItem = new CartItem();

            newItem.setCart(cart);
            newItem.setBook(book);
            newItem.setQuantity(quantity);

            // Save current book price
            newItem.setUnitPrice(book.getSellingPrice());

            BigDecimal subtotal =
                    book.getSellingPrice()
                            .multiply(BigDecimal.valueOf(quantity));

            newItem.setSubtotal(subtotal);

            cart.getItems().add(newItem);

            cartItemRepository.save(newItem);
        }

        cart.setUpdatedAt(java.time.LocalDateTime.now());
        cartRepository.save(cart);

        return convertToDTO(cart);
    }


    // =========================================================
    // UPDATE QUANTITY
    // =========================================================

    @Override
    public CartDTO updateQuantity(
            Long bookId,
            Integer quantity,
            String email) {

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository
                .findByCartIdAndBookId(cart.getId(), bookId)
                .orElseThrow(() ->
                        new RuntimeException("Book is not in cart"));

        Book book = cartItem.getBook();

        if (quantity > book.getStock()) {
            throw new RuntimeException("Not enough stock available");
        }

        cartItem.setQuantity(quantity);

        BigDecimal subtotal =
                cartItem.getUnitPrice()
                        .multiply(BigDecimal.valueOf(quantity));

        cartItem.setSubtotal(subtotal);

        cartItemRepository.save(cartItem);

        cart.setUpdatedAt(java.time.LocalDateTime.now());
        cartRepository.save(cart);

        return convertToDTO(cart);
    }


    // =========================================================
    // REMOVE FROM CART
    // =========================================================

    @Override
    public CartDTO removeFromCart(
            Long bookId,
            String email) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository
                .findByCartIdAndBookId(cart.getId(), bookId)
                .orElseThrow(() ->
                        new RuntimeException("Book is not in cart"));

        cart.getItems().remove(cartItem);

        cartItemRepository.delete(cartItem);

        cart.setUpdatedAt(java.time.LocalDateTime.now());
        cartRepository.save(cart);

        return convertToDTO(cart);
    }


    // =========================================================
    // CLEAR CART
    // =========================================================

    @Override
    public void clearCart(String email) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));

        cart.getItems().clear();

        cart.setUpdatedAt(java.time.LocalDateTime.now());

        cartRepository.save(cart);
    }


    // =========================================================
    // CREATE CART
    // =========================================================

    private Cart createCart(Customer customer) {

        Cart cart = new Cart();

        cart.setCustomer(customer);
        cart.setCreatedAt(java.time.LocalDateTime.now());
        cart.setUpdatedAt(java.time.LocalDateTime.now());
        cart.setItems(new ArrayList<>());

        return cartRepository.save(cart);
    }


    // =========================================================
    // CONVERT ENTITY -> DTO
    // =========================================================

    private CartDTO convertToDTO(Cart cart) {

        List<CartItemDTO> itemDTOs = new ArrayList<>();

        BigDecimal totalAmount = BigDecimal.ZERO;
        int totalItems = 0;

        for (CartItem item : cart.getItems()) {

            Book book = item.getBook();

            CartItemDTO dto = new CartItemDTO();

            dto.setId(item.getId());

            dto.setBookId(book.getId());

            dto.setTitle(book.getTitle());

            dto.setAuthor(book.getAuthor());

            dto.setCategory(
                    book.getCategory() != null
                            ? book.getCategory().getName()
                            : null
            );

            dto.setPrice(item.getUnitPrice());

            dto.setQuantity(item.getQuantity());

            dto.setStock(book.getStock());

            dto.setCoverImage(book.getCoverImage());

            dto.setSubtotal(item.getSubtotal());

            itemDTOs.add(dto);

            totalAmount = totalAmount.add(item.getSubtotal());

            totalItems += item.getQuantity();
        }

        CartDTO cartDTO = new CartDTO();

        cartDTO.setId(cart.getId());

        cartDTO.setCustomerId(
                cart.getCustomer().getId()
        );

        cartDTO.setItems(itemDTOs);

        cartDTO.setTotalAmount(totalAmount);

        cartDTO.setTotalItems(totalItems);

        return cartDTO;
    }
}