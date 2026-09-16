package lk.ijse.book_web.controller;

import lk.ijse.book_web.dto.AvatarUploadDTO;
import lk.ijse.book_web.dto.ChangePasswordDTO;
import lk.ijse.book_web.dto.CommonResponse;
import lk.ijse.book_web.dto.CustomerDTO;
import lk.ijse.book_web.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/customer")
@RequiredArgsConstructor
@CrossOrigin
public class CustomerController {

    private final CustomerService customerService;

    // Get logged-in customer's profile
    @GetMapping("/profile")
    public ResponseEntity<CommonResponse> getProfile(
            Authentication authentication) {

        String email = authentication.getName();

        CustomerDTO customerDTO =
                customerService.getCustomerByEmail(email);

        return ResponseEntity.ok(
                new CommonResponse(
                        HttpStatus.OK.value(),
                        customerDTO,
                        "Customer profile loaded successfully"
                )
        );
    }

    // Update logged-in customer's profile
    @PutMapping("/profile")
    public ResponseEntity<CommonResponse> updateProfile(
            Authentication authentication,
            @RequestBody CustomerDTO customerDTO) {

        String email = authentication.getName();

        CustomerDTO existingCustomer =
                customerService.getCustomerByEmail(email);

        CustomerDTO updatedCustomer =
                customerService.updateCustomer(
                        existingCustomer.getId(),
                        customerDTO
                );

        return ResponseEntity.ok(
                new CommonResponse(
                        HttpStatus.OK.value(),
                        updatedCustomer,
                        "Customer profile updated successfully"
                )
        );
    }

    // Change password
    @PutMapping("/change-password")
    public ResponseEntity<CommonResponse> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordDTO changePasswordDTO) {

        String email = authentication.getName();

        customerService.changePassword(
                email,
                changePasswordDTO
        );

        return ResponseEntity.ok(
                new CommonResponse(
                        HttpStatus.OK.value(),
                        null,
                        "Password changed successfully"
                )
        );
    }


    @PostMapping("/profile/avatar")
    public ResponseEntity<CommonResponse> updateAvatar(
            Authentication authentication,
            @RequestBody AvatarUploadDTO avatarDTO) {

        String email = authentication.getName();

        CustomerDTO customerDTO =
                customerService.updateProfileImage(
                        email,
                        avatarDTO.getProfileImage()
                );

        return ResponseEntity.ok(
                new CommonResponse(
                        HttpStatus.OK.value(),
                        customerDTO,
                        "Profile image updated successfully"
                )
        );
    }
}