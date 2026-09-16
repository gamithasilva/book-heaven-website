package lk.ijse.book_web.service.custom;

import lk.ijse.book_web.dto.AddressDTO;
import lk.ijse.book_web.entity.Address;
import lk.ijse.book_web.entity.Customer;
import lk.ijse.book_web.repository.AddressRepository;
import lk.ijse.book_web.repository.CustomerRepository;
import lk.ijse.book_web.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final CustomerRepository customerRepository;

    @Override
    public AddressDTO saveAddress(AddressDTO addressDTO) {
        Customer customer = customerRepository.findById(addressDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + addressDTO.getCustomerId()));

        Address address = mapToEntity(addressDTO, customer);

        if (Boolean.TRUE.equals(address.getIsDefault())) {
            addressRepository.resetDefaultAddressForCustomer(customer.getId());
        }

        Address savedAddress = addressRepository.save(address);
        return mapToDTO(savedAddress);
    }

    @Override
    public AddressDTO updateAddress(Long id, AddressDTO addressDTO) {
        Address existingAddress = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + id));

        if (Boolean.TRUE.equals(addressDTO.getIsDefault()) && !Boolean.TRUE.equals(existingAddress.getIsDefault())) {
            addressRepository.resetDefaultAddressForCustomer(existingAddress.getCustomer().getId());
        }

        existingAddress.setRecipientName(addressDTO.getRecipientName());
        existingAddress.setAddressLine1(addressDTO.getAddressLine1());
        existingAddress.setAddressLine2(addressDTO.getAddressLine2());
        existingAddress.setCity(addressDTO.getCity());
        existingAddress.setPostalCode(addressDTO.getPostalCode());
        existingAddress.setCountry(addressDTO.getCountry());
        existingAddress.setPhone(addressDTO.getPhone());
        existingAddress.setIsDefault(addressDTO.getIsDefault());

        Address updatedAddress = addressRepository.save(existingAddress);
        return mapToDTO(updatedAddress);
    }

    @Override
    public void deleteAddress(Long id) {
        if (!addressRepository.existsById(id)) {
            throw new RuntimeException("Address not found with id: " + id);
        }
        addressRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public AddressDTO getAddressById(Long id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + id));
        return mapToDTO(address);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressDTO> getAddressesByCustomerId(Long customerId) {
        return addressRepository.findByCustomerId(customerId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AddressDTO setDefaultAddress(Long customerId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + addressId));

        if (!address.getCustomer().getId().equals(customerId)) {
            throw new IllegalArgumentException("Address does not belong to the specified customer");
        }

        addressRepository.resetDefaultAddressForCustomer(customerId);
        address.setIsDefault(true);

        return mapToDTO(addressRepository.save(address));
    }

    private AddressDTO mapToDTO(Address address) {
        return AddressDTO.builder()
                .id(address.getId())
                .customerId(address.getCustomer() != null ? address.getCustomer().getId() : null)
                .recipientName(address.getRecipientName())
                .addressLine1(address.getAddressLine1())
                .addressLine2(address.getAddressLine2())
                .city(address.getCity())
                .postalCode(address.getPostalCode())
                .country(address.getCountry())
                .phone(address.getPhone())
                .isDefault(address.getIsDefault())
                .createdAt(address.getCreatedAt())
                .build();
    }

    private Address mapToEntity(AddressDTO dto, Customer customer) {
        Address address = new Address();
        address.setCustomer(customer);
        address.setRecipientName(dto.getRecipientName());
        address.setAddressLine1(dto.getAddressLine1());
        address.setAddressLine2(dto.getAddressLine2());
        address.setCity(dto.getCity());
        address.setPostalCode(dto.getPostalCode());
        address.setCountry(dto.getCountry());
        address.setPhone(dto.getPhone());
        address.setIsDefault(dto.getIsDefault() != null ? dto.getIsDefault() : false);
        return address;
    }
}