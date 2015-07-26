// This totally does not solve my problem and is probably unnecessary
mpConfig = mpConfiguration.findOne();

if (mpConfig && mpConfig._id) {

    MP.log ('INFO Loading #MeteorPress saved configuration', 2);
    _.extend(MP, mpConfig);
    MP.config = mpConfig;
    MP.installed = true;
    mpIsInstalled = true;
    mpIsNotInstalled = false;

} else {

    // Launch installer
    MP.log ('INFO #MeteorPress is not installed', 2);
    MP.installed = false;
    mpIsInstalled = false;
    mpIsNotInstalled = true;

};
