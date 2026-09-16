package lk.ijse.book_web.service;

import lk.ijse.book_web.dto.ChangePasswordDTO;
import lk.ijse.book_web.dto.CustomerDTO;

public interface CustomerService {

    CustomerDTO getCustomerById(Long id);

    CustomerDTO getCustomerByEmail(String email);

    CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO);

    void changePassword(String email, ChangePasswordDTO changePasswordDTO);

    CustomerDTO updateProfileImage(String email, String profileImage);

}