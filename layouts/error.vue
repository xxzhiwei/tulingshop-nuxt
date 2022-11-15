<template>
    <div>
        <h1 v-if="error.statusCode === 404">Page not found</h1>
        <h1 v-else>An error occurred</h1>
        <p v-if="error.message">{{error.message}}</p>
        <NuxtLink to="/">返回主页</NuxtLink>
    </div>
</template>

<script>
export default {
    props: ["error"],
    layout: "error", // you can set a custom layout for the error page
    created() {
        console.log(this.error);
    },
};
</script>