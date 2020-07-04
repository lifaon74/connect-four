module.exports = {
  name: 'connect-four',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/connect-four',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
