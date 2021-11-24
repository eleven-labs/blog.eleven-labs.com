task :default => [:lint, :build, :deploy]

# lint
task :lint => [:scss_lint]

# build
task :build => [:jekyll_build]

# deploy task
task :deploy => [:algolia_push]

# lint scss files
task :scss_lint do
  sh 'scss-lint _sass/'
end

# jekyll build
task :jekyll_build do
  jekyll('build')
end

# push to algolia
task :algolia_push do
  jekyll('algolia push --config _config.yml,_algolia.yml')
end

# launch jekyll
def jekyll(directives = '')
  sh 'jekyll ' + directives
end
