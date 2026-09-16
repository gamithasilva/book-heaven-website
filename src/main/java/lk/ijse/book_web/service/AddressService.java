package lk.ijse.book_web.service;

import lk.ijse.book_web.dto.AddressDTO;

import java.util.List;

public interface AddressService {
    AddressDTO saveAddress(AddressDTO addressDTO);
    AddressDTO updateAddress(Long id, AddressDTO addressDTO);
    void deleteAddress(Long id);
    AddressDTO getAddressById(Long id);
    List<AddressDTO> getAddressesByCustomerId(Long customerId);
    AddressDTO setDefaultAddress(Long customerId, Long addressId);
}