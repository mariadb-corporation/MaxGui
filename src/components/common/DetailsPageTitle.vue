<template>
    <portal to="page-title">
        <div class="d-flex align-center">
            <v-btn class="ml-n4" icon @click="$router.go(-1)">
                <v-icon class="mr-1" color="#013646">
                    $vuetify.icons.arrowLeft
                </v-icon>
            </v-btn>
            <h4
                style="line-height: normal;"
                class="ml-1 mb-0 color text-navigation display-1 text-capitalize page-title"
            >
                {{ $route.params.id }}
            </h4>
        </div>
    </portal>
</template>
