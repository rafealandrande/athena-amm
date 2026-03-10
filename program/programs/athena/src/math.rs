use anchor_lang::prelude::*;

pub fn optimize_swap_calculation(
    amount_in: u64,
    reserve_in: u64,
    reserve_out: u64,
    fee_rate: u16,
) -> u64 {
    let fee_multiplier = 10000u128 - fee_rate as u128;
    let amount_in_with_fee = (amount_in as u128 * fee_multiplier) >> 14;
    
    let numerator = amount_in_with_fee * reserve_out as u128;
    let denominator = (reserve_in as u128 << 14) + amount_in_with_fee;
    
    (numerator / denominator) as u64
}
