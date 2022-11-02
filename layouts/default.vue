<template>
    <div>
        <NavHeader v-on:search="search" />
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
    methods: {
        search(keywords) {
            console.log(keywords);
            this.$router.push({
                path: "/search",
                query: {
                    keywords
                }
            });
        }
    }
};
</script>