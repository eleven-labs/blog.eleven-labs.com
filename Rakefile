task :default => [:lint, :test, :deploy]

# lint
task :lint => [:scss_lint, :check_spelling]

# testsuite
task :test => [:jekyll_build]

# deploy task
task :deploy => [:algolia_push]

# lint scss files
task :scss_lint do
  sh 'scss-lint _sass/'
end

task :check_spelling do
  sh './bin/check-spelling.sh'
end

# test jekyll build
task :jekyll_build do
  jekyll('build')
end

# push to algolia
task :algolia_push do
#  if ENV['TRAVIS_BRANCH'] == 'master' && ENV['TRAVIS_PULL_REQUEST'] == "false"
  jekyll('algolia push')
#  end
end

# launch jekyll
def jekyll(directives = '')
  sh 'jekyll ' + directives
end
