/**
 * bread-particles.ts
 *
 * This file contains the particle emitter that is fired when a bread is shot
 */
import * as Phaser from 'phaser';

export class BreadParticles extends Phaser.GameObjects.Particles
  .ParticleEmitterManager {
  constructor(scene: Phaser.Scene) {
    super(scene, 'bread');

    scene.add.existing(this);
  }
}
