<template>
    <portal to="page-title">
        <div class="d-flex align-center">
            <v-btn class="ml-n2" icon @click="$router.go(-1)">
                <v-icon
                    class="mr-2"
                    style="transform:rotate(180deg);width: 28px;"
                    size="28"
                    color="#013646"
                >
                    $vuetify.icons.arrowRight
                </v-icon>
            </v-btn>
            <h4
                style="line-height: 10px;"
                class="mb-0 color text-navigation text-navigation display-1 text-capitalize page-title"
            >
                {{ $route.params.id }}
            </h4>
        </div>
    </portal>
</template>
