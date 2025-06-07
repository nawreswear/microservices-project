
package com.salesapp.devise.repository;

import com.salesapp.devise.model.Devise;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviseRepository extends JpaRepository<Devise, Long> {
}
