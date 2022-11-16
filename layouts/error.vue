<template>
    <div style="text-align: center; min-height: 500px;">
        <h1  style="margin-bottom: 20px;" v-if="error.statusCode === 404">Page not found</h1>
        <h1 style="margin-bottom: 20px;" v-else>An error occurred</h1>
        <p style="margin-bottom: 20px;" v-if="error.message">{{error.message}}</p>
        <span @click="goBack" style="margin-left: 10px; cursor: pointer;">返回上一步</span>
        <NuxtLink to="/">返回主页</NuxtLink>
    </div>
</template>

<script>
export default {
    props: ["error"],
    layout: "error", // you can set a custom layout for the error page
    created() {
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        }
    },
};
</script>