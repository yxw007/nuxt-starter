import { defineNuxtPlugin } from '#app'
import { ClickOutside } from '~/composables/directives/click-outside'
import { HoverEl } from '~/composables/directives/hover-el'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive("click-outside", ClickOutside)
	nuxtApp.vueApp.directive("hover-el", HoverEl)
})
