# conda.sh

(mini)-conda install made easy.

It can be quite complicated for users to select which miniconda Installer to
download and install. This is an attempt at making the following command do the
right thing.

```
$ bash <(curl -L conda.sh)
```

## how does it work ?

Depending on the context, `conda.sh` will either:
 - display an html pages with explanation,
 - be a shell/CMD executable script that will detect current os/CPU, then
   download and install the right executable.

