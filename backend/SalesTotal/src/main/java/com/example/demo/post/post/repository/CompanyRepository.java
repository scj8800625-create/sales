package com.example.demo.post.post.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.member.member.entity.UserInfo;
import com.example.demo.post.post.entity.Company;
import com.example.demo.post.post.entity.CompanyInfo;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

	List<Company> findByCompanyInfo(CompanyInfo companyInfo);

	Company findAllById(Long id);

	Company findByIdAndCompanyInfo(Long id, CompanyInfo companyInfo);

	Company findByUserInfoAndCompanyInfo(UserInfo userInfo, CompanyInfo comInfo);

	List<Company> findAllByCompanyInfo(CompanyInfo companyInfo);

}
