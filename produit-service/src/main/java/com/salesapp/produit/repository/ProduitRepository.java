package com.salesapp.produit.repository;

import com.salesapp.produit.model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
    
    List<Produit> findByCategorieId(Long categorieId);
    
    @Query("SELECT p FROM Produit p WHERE p.stockDisponible <= p.stockMinimum")
    List<Produit> findProduitsEnRuptureDeStock();
    
    @Query("SELECT p FROM Produit p WHERE p.nom LIKE %:nom%")
    List<Produit> findByNomContaining(@Param("nom") String nom);
    
    @Query("SELECT p FROM Produit p ORDER BY p.stockDisponible ASC")
    List<Produit> findAllOrderByStockAsc();
    
    @Query("SELECT p FROM Produit p WHERE p.prix BETWEEN :prixMin AND :prixMax")
    List<Produit> findByPrixBetween(@Param("prixMin") Double prixMin, @Param("prixMax") Double prixMax);
}