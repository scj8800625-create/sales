package com.example.demo.post.post.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.post.post.entity.BuyList;
import com.example.demo.post.post.entity.Trade;

@Repository
public interface BuyListRepository extends JpaRepository<BuyList, Long> {

	BuyList findAllById(Long id);

	List<BuyList> findByTrade(Trade trade);

	BuyList findByIdAndTrade(Long id, Trade trade);

	BuyList findByTradeAndId(Trade trade, Long id);

	List<BuyList> findAllByTrade(Trade trade);

}
