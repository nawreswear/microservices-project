
package com.salesapp.devise.model;

import jakarta.persistence.*;

@Entity
public class Devise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String name;
    private double exchangeRate;

    // Getters and Setters
}
