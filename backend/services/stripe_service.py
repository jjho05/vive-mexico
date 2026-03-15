import os
import stripe
from typing import Optional, Tuple

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")

DEFAULT_FEE_PERCENT = float(os.getenv("STRIPE_FEE_PERCENT", "0.036"))
DEFAULT_FEE_FIXED_MXN = float(os.getenv("STRIPE_FEE_FIXED_MXN", "3.0"))
DEFAULT_FEE_EXTRA_PERCENT = float(os.getenv("STRIPE_FEE_EXTRA_PERCENT", "0.0"))


def compute_fee_mxn(amount_mxn: float) -> float:
    percent_fee = amount_mxn * (DEFAULT_FEE_PERCENT + DEFAULT_FEE_EXTRA_PERCENT)
    return round(percent_fee + DEFAULT_FEE_FIXED_MXN, 2)


def create_connect_account(email: Optional[str], name: Optional[str], phone: Optional[str]) -> str:
    account = stripe.Account.create(
        type="express",
        country="MX",
        email=email,
        business_type="individual",
        business_profile={
            "product_description": "Cobros de Ola México",
        },
        individual={
            "first_name": (name or "Comerciante").split(" ")[0],
        },
        capabilities={
            "card_payments": {"requested": True},
            "transfers": {"requested": True},
        },
        phone=phone,
    )
    return account["id"]


def create_account_link(account_id: str, refresh_url: str, return_url: str) -> str:
    link = stripe.AccountLink.create(
        account=account_id,
        refresh_url=refresh_url,
        return_url=return_url,
        type="account_onboarding",
    )
    return link["url"]


def get_account_status(account_id: str) -> Tuple[bool, bool]:
    account = stripe.Account.retrieve(account_id)
    return bool(account.get("charges_enabled")), bool(account.get("payouts_enabled"))


def create_checkout_session(
    amount_mxn: float,
    fee_mxn: float,
    destination_account: str,
    success_url: str,
    cancel_url: str,
    idempotency_key: Optional[str] = None,
    description: Optional[str] = None,
) -> str:
    total_mxn = round(amount_mxn + fee_mxn, 2)
    unit_amount = int(round(total_mxn * 100))
    fee_amount = int(round(fee_mxn * 100))
    session = stripe.checkout.Session.create(
        mode="payment",
        success_url=success_url,
        cancel_url=cancel_url,
        payment_method_types=["card"],
        line_items=[
            {
                "price_data": {
                    "currency": "mxn",
                    "product_data": {"name": description or "Cobro Ola México"},
                    "unit_amount": unit_amount,
                },
                "quantity": 1,
            }
        ],
        payment_intent_data={
            "application_fee_amount": fee_amount,
            "transfer_data": {"destination": destination_account},
        },
        idempotency_key=idempotency_key,
    )
    return session["url"]
