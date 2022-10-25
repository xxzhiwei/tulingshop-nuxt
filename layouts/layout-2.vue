<template>
    <div>
        <OrderHeader>
            <template v-slot:tip>
                <span>温馨提示：产品是否购买成功，以最终下单为准哦，请尽快结算</span>
            </template>
        </OrderHeader>
        <nuxt />
        <ServiceBar />
    </div>
</template>

<script>
import OrderHeader from "@/components/OrderHeader";
import ServiceBar from "@/components/ServiceBar";
export default {
    components: {
        OrderHeader,
        ServiceBar,
    },
};
</script>