package com.example.demo.post.post.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class ProductInfo {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(unique = true)
	private String productNumber;
	@Column(unique = true)
	private String productName;
	private Long stock;
	private Long productPrice;
	private LocalDateTime createAT;
	@Column(columnDefinition = "LONGTEXT")
	private String image;

	public ProductInfo(String productNumber, String productName, Long stock, Long productPrice, String Image) {
		this.productNumber = productNumber;
		this.productName = productName;

		this.stock = stock;
		this.productPrice = productPrice;
		this.image = Image;
		this.createAT = LocalDateTime.now();

	}

}
