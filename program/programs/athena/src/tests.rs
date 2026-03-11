use anchor_lang::prelude::*;
use crate::*;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_swap_calculation() {
        let amount_in = 1000;
        let reserve_in = 10000;
        let reserve_out = 10000;
        let fee_rate = 30;

        let amount_out = calculate_swap_output(
            amount_in,
            reserve_in,
            reserve_out,
            fee_rate
        );

        assert!(amount_out > 0);
        assert!(amount_out < amount_in);
    }
}
