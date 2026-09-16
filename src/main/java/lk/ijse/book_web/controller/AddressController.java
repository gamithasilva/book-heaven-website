package lk.ijse.book_web.controller;

import lk.ijse.book_web.dto.AddressDTO;
import lk.ijse.book_web.dto.CommonResponse;
import lk.ijse.book_web.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/customer/addresses")
@RequiredArgsConstructor
@CrossOrigin
public class AddressController {

    private final AddressService addressService;


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse saveAddress(
            @RequestBody AddressDTO addressDTO
    ) {

        AddressDTO savedAddress = addressService.saveAddress(addressDTO);

        return new CommonResponse(
                HttpStatus.CREATED.value(),
                savedAddress,
                "Address saved successfully"
        );
    }


    @GetMapping("/{id}")
    public CommonResponse getAddressById(
            @PathVariable Long id
    ) {

        AddressDTO address = addressService.getAddressById(id);

        return new CommonResponse(
                HttpStatus.OK.value(),
                address,
                "Address fetched successfully"
        );
    }

    @GetMapping("/customer/{customerId}")
    public CommonResponse getAddressesByCustomerId(
            @PathVariable Long customerId
    ) {

        List<AddressDTO> addresses =
                addressService.getAddressesByCustomerId(customerId);

        return new CommonResponse(
                HttpStatus.OK.value(),
                addresses,
                "Customer addresses fetched successfully"
        );
    }


    @PutMapping("/{id}")
    public CommonResponse updateAddress(
            @PathVariable Long id,
            @RequestBody AddressDTO addressDTO
    ) {

        AddressDTO updatedAddress =
                addressService.updateAddress(id, addressDTO);

        return new CommonResponse(
                HttpStatus.OK.value(),
                updatedAddress,
                "Address updated successfully"
        );
    }

    // =========================================================
    // DELETE ADDRESS
    // =========================================================

    @DeleteMapping("/{id}")
    public CommonResponse deleteAddress(
            @PathVariable Long id
    ) {

        addressService.deleteAddress(id);

        return new CommonResponse(
                HttpStatus.OK.value(),
                null,
                "Address deleted successfully"
        );
    }

    @PutMapping("/{addressId}/default/{customerId}")
    public CommonResponse setDefaultAddress(
            @PathVariable Long addressId,
            @PathVariable Long customerId
    ) {

        AddressDTO address =
                addressService.setDefaultAddress(customerId, addressId);

        return new CommonResponse(
                HttpStatus.OK.value(),
                address,
                "Default address updated successfully"
        );
    }
}