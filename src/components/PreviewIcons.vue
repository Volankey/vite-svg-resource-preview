<template>
    <n-space>
    <!-- icons template start -->
    <!-- icons template end -->
</n-space>
</template>

<script setup lang="ts">
import {NSpace,NPopover} from 'naive-ui'
// icons script start
// icons script end
</script>

<style>
.icon-container{
    min-width: 32px;
    width: fit-content;
    height: 32px;
    position: relative;
    display: block;
}
svg{
    z-index: 10;
    height: 32px;
    position: relative;
    /* mix-blend-mode: difference; */
}

.checkboard {
    background: white;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    &::after {
      background-image: linear-gradient(45deg, #333 25%, #0000 25%), linear-gradient(-45deg, #333 25%, #0000 25%), linear-gradient(45deg, #0000 75%, #333 75%), linear-gradient(-45deg, #0000 75%, #333 75%);
      background-size: 12px 12px;
      background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
      background-repeat: repeat;
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-size: calc(var(32px) * 2) calc(var(32px) * 2);
      background-position: 0 0, 0 var(32px), var(32px) calc(-1 * var(32px)), calc(-1 * var(32px)) 0px;
      opacity: .1;
    }

  }
</style>