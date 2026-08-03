package com.example.demo.post.post.dto;



import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class ProductInfoDTO {
	private String status;

	public ProductInfoDTO(String status) {
		this.status = status;

	}
}
