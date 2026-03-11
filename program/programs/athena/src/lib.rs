use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Athena11111111111111111111111111111111111");

#[program]
pub mod athena {
    use super::*;

    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        fee_rate: u16,
        max_risk_score: u8,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.authority.key();
        pool.token_a_mint = ctx.accounts.token_a_mint.key();
        pool.token_b_mint = ctx.accounts.token_b_mint.key();
        pool.token_a_vault = ctx.accounts.token_a_vault.key();
        pool.token_b_vault = ctx.accounts.token_b_vault.key();
        pool.fee_rate = fee_rate;
        pool.max_risk_score = max_risk_score;
        pool.anti_sniper_enabled = true;
        pool.total_volume = 0;
        pool.snipers_blocked = 0;
        pool.bump = *ctx.bumps.get("pool").unwrap();
        Ok(())
    }

    pub fn add_liquidity(
        ctx: Context<AddLiquidity>,
        amount_a: u64,
        amount_b: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_token_a.to_account_info(),
                    to: ctx.accounts.token_a_vault.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount_a,
        )?;

        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_token_b.to_account_info(),
                    to: ctx.accounts.token_b_vault.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount_b,
        )?;

        Ok(())
    }

    pub fn swap(
        ctx: Context<Swap>,
        amount_in: u64,
        min_amount_out: u64,
        risk_score: u8,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        
        require!(
            !pool.anti_sniper_enabled || risk_score <= pool.max_risk_score,
            ErrorCode::SniperDetected
        );

        if risk_score > pool.max_risk_score {
            pool.snipers_blocked += 1;
            return Err(ErrorCode::SniperDetected.into());
        }

        let vault_a_amount = ctx.accounts.token_a_vault.amount;
        let vault_b_amount = ctx.accounts.token_b_vault.amount;

        let amount_out = calculate_swap_output(
            amount_in,
            vault_a_amount,
            vault_b_amount,
            pool.fee_rate,
        );

        require!(
            amount_out >= min_amount_out,
            ErrorCode::SlippageExceeded
        );

        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_token_a.to_account_info(),
                    to: ctx.accounts.token_a_vault.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount_in,
        )?;

        let seeds = &[
            b"pool",
            pool.token_a_mint.as_ref(),
            pool.token_b_mint.as_ref(),
            &[pool.bump],
        ];
        let signer = &[&seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.token_b_vault.to_account_info(),
                    to: ctx.accounts.user_token_b.to_account_info(),
                    authority: pool.to_account_info(),
                },
                signer,
            ),
            amount_out,
        )?;

        pool.total_volume += amount_in;

        Ok(())
    }
}

fn calculate_swap_output(
    amount_in: u64,
    reserve_in: u64,
    reserve_out: u64,
    fee_rate: u16,
) -> u64 {
    let amount_in_with_fee = (amount_in as u128)
        .checked_mul((10000 - fee_rate as u128)).unwrap()
        .checked_div(10000).unwrap();
    
    let numerator = amount_in_with_fee
        .checked_mul(reserve_out as u128).unwrap();
    
    let denominator = (reserve_in as u128)
        .checked_add(amount_in_with_fee).unwrap();
    
    numerator.checked_div(denominator).unwrap() as u64
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Pool::LEN,
        seeds = [b"pool", token_a_mint.key().as_ref(), token_b_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_a_mint: Account<'info, token::Mint>,
    pub token_b_mint: Account<'info, token::Mint>,
    
    #[account(
        init,
        payer = authority,
        token::mint = token_a_mint,
        token::authority = pool,
    )]
    pub token_a_vault: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = authority,
        token::mint = token_b_mint,
        token::authority = pool,
    )]
    pub token_b_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct AddLiquidity<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_a: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_token_b: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub token_a_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub token_b_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_a: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_token_b: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub token_a_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub token_b_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Pool {
    pub authority: Pubkey,
    pub token_a_mint: Pubkey,
    pub token_b_mint: Pubkey,
    pub token_a_vault: Pubkey,
    pub token_b_vault: Pubkey,
    pub fee_rate: u16,
    pub max_risk_score: u8,
    pub anti_sniper_enabled: bool,
    pub total_volume: u64,
    pub snipers_blocked: u64,
    pub bump: u8,
}

impl Pool {
    pub const LEN: usize = 32 + 32 + 32 + 32 + 32 + 2 + 1 + 1 + 8 + 8 + 1;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Sniper bot detected - transaction blocked")]
    SniperDetected,
    #[msg("Slippage tolerance exceeded")]
    SlippageExceeded,
}
