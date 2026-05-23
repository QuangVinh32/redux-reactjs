package com.shopbm.Repository;

import com.shopbm.Model.Entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    List<PaymentMethod> findAllByActiveTrueOrderByDisplayOrderAsc();
    Optional<PaymentMethod> findByCode(String code);
}
