package com.salesapp.auth.repositories;

import java.util.List;
import com.salesapp.auth.entities.AppRole;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;

@RepositoryRestResource
public interface AppRoleRepository extends JpaRepository<AppRole, Long>{
    @PreAuthorize("hasAuthority('ROLE_USER')")
    AppRole findByRoleName(String roleName);

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    <S extends AppRole> S save(S entity);

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    void delete(AppRole entity);

    @PreAuthorize("hasAuthority('ROLE_USER')")
    <S extends AppRole> List<S> findAll(Example<S> example);

}
