document.addEventListener("DOMContentLoaded", function () {
	var revealItems = document.querySelectorAll(".mv-reveal[data-animate]");

	if (!revealItems.length) {
		return;
	}

	var observer = new IntersectionObserver(
		function (entries, obs) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) {
					return;
				}

				var element = entry.target;
				var animationName = element.getAttribute("data-animate") || "animate__fadeInUp";
				element.classList.add("animate__animated", animationName, "mv-in-view");
				obs.unobserve(element);
			});
		},
		{
			threshold: 0.2,
			rootMargin: "0px 0px -40px 0px"
		}
	);

	revealItems.forEach(function (item) {
		observer.observe(item);
	});
});
