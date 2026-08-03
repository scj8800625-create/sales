package com.example.demo.post.post.entity;



import com.example.demo.member.member.entity.UserInfo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Company {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	private UserInfo userInfo;

	@ManyToOne
	private CompanyInfo companyInfo;

	// private String companyDetail;
	// private String companyLocation;
	// private String companySort;

	public Company(UserInfo userInfo, CompanyInfo companyInfo) {
		this.userInfo = userInfo;
		this.companyInfo = companyInfo;
		// this.companySort = companySort;
	}

}
