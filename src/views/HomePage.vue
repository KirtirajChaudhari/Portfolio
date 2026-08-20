<template>
  <XRayHero />
  <AboutSection />
  <ExperienceTimeline />
  <EducationSection />
  <ProjectsGrid />
  <ExpertiseSection />
  <SkillsSection />
  <CertificationsSection />
  <AchievementsSection />
  <ContactSection />
</template>

<script setup lang="ts">
/* HeroSection.vue is still in the tree — Loop 7 decides whether the status
   rail and social row move across before it is deleted. */
import XRayHero from '../components/hero/XRayHero.vue';
import AboutSection from '../components/chapter-one/AboutSection.vue';
import ExperienceTimeline from '../components/chapter-one/ExperienceTimeline.vue';
import EducationSection from '../components/chapter-one/EducationSection.vue';
import ProjectsGrid from '../components/chapter-one/ProjectsGrid.vue';
import ExpertiseSection from '../components/chapter-one/ExpertiseSection.vue';
import SkillsSection from '../components/chapter-one/SkillsSection.vue';
import CertificationsSection from '../components/chapter-one/CertificationsSection.vue';
import AchievementsSection from '../components/chapter-one/AchievementsSection.vue';
import ContactSection from '../components/chapter-one/ContactSection.vue';
</script>
