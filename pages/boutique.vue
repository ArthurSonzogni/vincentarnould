<script setup lang="ts">
const home = await queryCollection('content').path('/').first();
console.log(home);

const videos = ref(home.meta.videos);

useSeoMeta({
  title: home.title,
  description: home.description
})

const currentVideo = ref(1);

const nextVideo = () => {
  currentVideo.value = (currentVideo.value + 1) % videos.length;
};

const prevVideo = () => {
  currentVideo.value = (currentVideo.value - 1 + videos.length) % videos.length;
};

const images = ref(home.meta.images);

// Resolve the image[i].link with the base URL.
//const origin = window.location.origin;
//for (let i = 0; i < images.value.length; i++) {
//  images.value[i].link = new URL(images.value[i].link, origin).href;
//}


</script>

<template>
  <div>
    <h1>
      {{ home.title }}
    </h1>

    <div>
      <SeeBelow />
      <UCarousel
        v-slot="{ item }"
        orientation="horizontal"
        :items="videos"
        dots
        :autoplay="{ delay: 3000 }"
        >
        <div class="video-title">
          {{ item.title }}
        </div>
        <div class="video-container">
          <video
            autoplay
            preload="auto"
            playsinline
            webkit-playsinline
            autoscroll
            loop
            muted
            :src="item.landscape"
            class="background-video"
            >
            <source :src="item.portrait" media="(orientation: portrait)" />
              <source :src="item.landscape" media="(orientation: landscape)" />
          </video>
        </div>
      </UCarousel>

      <div v-for="(image, index) in images" :key="index" class="image-item">
        <NuxtLink :to="image.link">
        <ImageFullscreen
          :image_portrait="image.image_portrait"
          :image_landscape="image.image_landscape"
          :title="image.title"
          />
        </NuxtLink>
      </div>

    </div>

  </div>
</template>

<style scoped>
h1 {
  color: white;
  font-family: "Cinzel", sans-serif;
  font-size: 48px;
  font-weight: 50;
  left: 0;
  position:fixed;
  text-align: center;
  top: 1rem;
  width: 100%;
  z-index: 1;
  text-shadow:
    0px 0px 1px rgba(0, 0, 0, 0.7),
    0px 1px 1px rgba(0, 0, 0, 0.5),
    0px 2px 1px rgba(0, 0, 0, 0.3),
    0px 3px 1px rgba(0, 0, 0, 0.1),
    0px 4px 5px rgba(0, 0, 0, 1.0);
}

@keyframes move-bg {
  to {
    background-position: 0 var(--bg-size);
  }
}

.video-container {
  position: relative;
  width: 100svw;
  height: 100svh;
  overflow: hidden;
}

.video-title {
  bottom: 0;
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
  position:absolute;
  text-align: center;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);
  width: 100%;
  z-index: 1;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.controls {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.control-btn {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

</style>
