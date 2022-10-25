<template>
    <div>
        <NavHeader />
        <nuxt />
        <NavFooter />
    </div>
</template>

<script>
import NavHeader from "@/components/NavHeader";
import NavFooter from "@/components/NavFooter";
export default {
    components: {
        NavHeader,
        NavFooter,
    },
};
</script>