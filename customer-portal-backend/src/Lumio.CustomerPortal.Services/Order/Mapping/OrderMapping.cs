using Lumio.Domain.Entities;

namespace Lumio.CustomerPortal.Services.Order
{
    public static class OrderMapping
    {
        public static OrderDetailDto ToOrderDetailDto(this om_order order)
        {
            OrderDetailDto dto = new OrderDetailDto()
            {
                OrderId = order.order_id,
                OrderNumber = order.market_order_number,
                SaleDate = order.sale_date,
                CreatedDate = order.created_at,
                OrderStatus = order.order_status,
                ItemNumber = order.item_market_id,
                ItemTitle = order.item_title,
                ItemCondition = order.item_condition,
                Supplier = order.supplier,
                Quantity = order.quantity,
                UnitPrice = order.market_sale_price,
                ShippingFee = order.market_shipping_fee,
                SaleTax = order.market_sale_tax,
                TotalPrice = order.market_total_price,
                ShipToName = order.buyer_address.full_name,
                ShipToAddress1 = order.buyer_address.address1,
                ShipToAddress2 = order.buyer_address.address2,
                ShipToCity = order.buyer_address.city,
                ShipToState = order.buyer_address.state,
                ShipToZip = order.buyer_address.zip,
                ShipToCountry = order.buyer_address.country,
                ShipToPhone = order.buyer_address.phone,
            };

            if (order.supplier.ToLower() == "amazon")
            {
                var parts = order.item_supplier_url.Split('/');
                dto.Sku = parts[parts.Length - 1];
            }

            if (order.purchase != null)
            {
                dto.Purchase = new PurchaseDto()
                {
                    StartTime = order.purchase.start_time,
                    EndTime = order.purchase.end_time,
                    SupplierOrderNumber = order.purchase.supplier_order_number,
                    SupplierTotalPrice = order.purchase.supplier_total_price,
                    EstimatedArrivalTime = order.purchase.estimated_arrival_time
                };
            }

            if (order.tracking != null)
            {
                dto.Tracking = new TrackingDto()
                {
                    OriginalTrackingNumber = order.tracking.original_tracking_number,
                    OriginalCarrier = order.tracking.original_tracking_carrier,
                    TrackingNumber = order.tracking.tracking_number,
                    Carrier = order.tracking.tracking_carrier,
                };
            }

            return dto;
        }

        public static PurchaseAttemptDto ToPurchaseAttemptDto(this om_purchase_attempt attempt)
        {
            var dto = new PurchaseAttemptDto()
            {
                Id = attempt.purchase_id,
                StartTime = attempt.start_at,
                EndTime = attempt.end_at,
                Status = attempt.status,
                Reason = attempt.reason,
                Note = attempt.note,
            };

            return dto;
        }
    }
}
