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
public class CompanyInfo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(unique = true)
	private String companyName;
	@Column(unique = true)
	private String companyNumber;
	private LocalDateTime createAT;

	public CompanyInfo(String companyName, String companyNumber) {
		this.companyName = companyName;
		this.companyNumber = companyNumber;
		this.createAT = LocalDateTime.now();
	}
}
