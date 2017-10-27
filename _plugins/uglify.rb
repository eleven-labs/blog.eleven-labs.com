module Jekyll
  module Uglify
    def uglify(input)
      Uglifier.new(:harmony => true).compile(input)
    end
  end
end

Liquid::Template.register_filter(Jekyll::Uglify)
